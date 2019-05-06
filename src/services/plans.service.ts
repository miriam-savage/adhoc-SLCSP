const neatCsv = require('neat-csv');
const fs = require('fs');

import { Plan, Rate } from '../interfaces/plan.interface';
import { Utils } from '../utils/utils';

export class PlansService {
    private planFile: string | null = null;
    plans: Plan[] = new Array();
    silverRates: Rate[] = new Array();

    constructor(){}

    setPlanFile(location: string) {
        this.planFile = location;
    }

    async getPlanData(): Promise<Plan[]> {
        if(this.planFile == null) {
            return [];
        }

        const data = fs.readFileSync(this.planFile);
        this.plans = await neatCsv(data);

        return this.plans;
    }

    async setSlcspPlans() {
        const silverData = this.plans.filter(p => p.metal_level === 'Silver').map(mp => {
            return {
                rate: parseFloat(String(mp.rate)),
                rateId: mp.state + mp.rate_area,
                rate_area: parseInt(String(mp.rate_area),10)
            }; 
         });

        this.silverRates = Utils.sortByNumber(silverData, 'rate', true);
        this.silverRates = this.distinctRates();
    }

    distinctRates() {
        const map = new Map();
        const result = [];

        for (const sPlan of this.silverRates) {
            const pid = sPlan.rateId + '-' + sPlan.rate;
            if(!map.has(pid)){
                map.set(pid, true); 
                result.push({
                    rate: sPlan.rate,
                    rateId: sPlan.rateId,
                    rate_area: sPlan.rate_area,
                });
            }
        }

        return result;
    }
}