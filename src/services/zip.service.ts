const neatCsv = require('neat-csv');
const fs = require('fs');

import { Zip } from '../interfaces/zip.interface';
import { Slcp } from '../interfaces/slcp.interface';

export class ZipService {
    private zipFile: string | null = null;
    private zipListFile: string | null = null;
    zips: Zip[] = new Array();
    zipList: Slcp[] = new Array();
    
    constructor(){}

    setZipFile(location: string) {
        this.zipFile = location;
    }

    setZipListFile(location: string) {
        this.zipListFile = location;
    }

    async getZipData(): Promise<Zip[]> {
        if(this.zipFile == null) {
            return [];
        }

        const data = fs.readFileSync(this.zipFile);
        this.zips = await neatCsv(data);
        this.zips = this.zips.map(z => {
            return {
                zipcode: z.zipcode,
                state: z.state,
                county_code: parseFloat(String(z.county_code)),
                name: z.name,
                rate_area: parseInt(String(z.rate_area),10),
                rateId: z.state+z.rate_area
            }; 
         });     

        return this.zips;
    }

    async getZipList(): Promise<Slcp[]> {
        if(this.zipListFile == null) {
            return [];
        }

        const data = fs.readFileSync(this.zipListFile);
        this.zipList = await neatCsv(data);
        this.zipList = this.zipList.map(z => {
            return {
                zipcode: z.zipcode,
                rate: z.rate, 
                // rate_area: parseInt(String(z.rate_area),10),
                // rateId: z.rateId
            }; 
         });

        return this.zipList;
    }
}