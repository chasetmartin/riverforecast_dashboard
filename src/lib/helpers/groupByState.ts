export function groupByState(gauges: any[]) {
    const grouped = gauges.reduce((groups, gauge) => {
        const state = gauge.state.name;
        if (!groups[state]) {
            groups[state] = [];
        }
        groups[state].push(gauge);
        return groups;
    }, {});

    // Convert the object into an array of [key, value] pairs
    const sorted = Object.entries(grouped).sort((a, b) => {
        // Sort by the state name, which is the key of the entries
        return a[0].localeCompare(b[0]);
    });

    // Convert it back into an object if needed
    return sorted.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}