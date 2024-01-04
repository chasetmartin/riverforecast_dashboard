export function findFloodStatement(gauge: {
    flood: { impacts: string | any[] };
    status: { observed: { primary: number } };
}) {
    if (!gauge.flood || !gauge.flood.impacts) {
        return null;
    }

    let closestImpact = null;

    for (let i = 0; i < gauge.flood.impacts.length; i++) {
        const impact = gauge.flood.impacts[i];
        if (impact && gauge.status.observed.primary >= impact.stage) {
            if (!closestImpact || impact.stage > closestImpact.stage) {
                closestImpact = impact;
            }
        }
    }

    return closestImpact ? closestImpact.statement : 'no flood statement';
}