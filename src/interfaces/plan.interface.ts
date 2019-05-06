export interface Rate {
    rate: number;
    rate_area: number;
    rateId: string;
}

export interface Plan extends Rate {
    plan_id: string;
    state: string;
    metal_level: string;
}