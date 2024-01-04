export function groupByState(gauges: any[]) {
    return gauges.reduce((groups, gauge) => {
        const state = gauge.state.name;
        if (!groups[state]) {
            groups[state] = [];
        }
        groups[state].push(gauge);
        return groups;
    }, {});
}