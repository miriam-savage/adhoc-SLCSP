export class Utils {
    static sortByNumber(items: any[], field: string, ascending: boolean) {
        return items.sort((a, b) => {
            const x = a[field] ? a[field] : 0;
            const y = b[field] ? b[field] : 0;
            if (ascending) {
                return ((x < y)
                    ? -1
                    : ((x > y) ? 1 : 0));
            } else {
                return ((x > y)
                    ? -1
                    : ((x < y) ? 1 : 0));
            }
        });
    }

}