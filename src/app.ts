const fs = require('fs');

import { PlansService } from "./services/plans.service";
import { ZipService } from "./services/zip.service";
import { Zip } from "./interfaces/zip.interface";

const plansService: PlansService = new PlansService();
const zipService: ZipService = new ZipService();

plansService.setPlanFile('./csvFiles/plans.csv'); 
zipService.setZipFile('./csvFiles/zips.csv');
zipService.setZipListFile('./csvFiles/slcsp.csv');

getData().then(() => {
    plansService.setSlcspPlans();

    let stdoutString = 'zipcode,rate\n';

    for(const i in zipService.zipList) {
        if(zipService.zipList[i]) {
            const cZip = zipService.zipList[i];
            const zipData: Zip[] = zipService.zips.filter(z => z.zipcode === cZip.zipcode);
            let curZip: Zip | undefined = undefined;

            stdoutString += zipData[0].zipcode + ',';
    
            if (zipData.length === 1) {
                curZip = zipData[0];
            } else if (zipData.length > 1) {
                stdoutString += '\n';
            }

            if (curZip !== undefined) {
                const rateId = curZip.rateId;
                const sPlans = plansService.silverRates.filter(p => p.rateId === rateId);

                if(sPlans.length > 2) {
                    zipService.zipList[i].rate = sPlans[1].rate.toFixed(2);
                    stdoutString += sPlans[1].rate.toFixed(2) + '\n';
                } else {
                    zipService.zipList[i].rate = '-1';
                    stdoutString += '\n';
                }
            }
        }
    }
    
    writeToFile(stdoutString);
    console.log(stdoutString);
});


async function getData() {
    const planData = await plansService.getPlanData();
    // console.log(`Plan Data: ${JSON.stringify(planData, undefined, 2)}`);

    const zipData = await zipService.getZipData();
    // console.log(`Zip Data: ${JSON.stringify(zipData, undefined, 2)}`);

    const zipList = await zipService.getZipList();
    // console.log(`Zip List original: ${JSON.stringify(zipList, undefined, 2)}`);
}

function writeToFile(data: string) {
    const dataToFile = new Uint8Array(Buffer.from(data));
    fs.writeFile('./csvFiles/stdout.csv', dataToFile, (err: Error) => {
        if (err) throw err;
        console.log('The output has been saved to: ./csvFiles/stdout.csv');
    });
}
