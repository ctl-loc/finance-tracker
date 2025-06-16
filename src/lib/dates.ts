/* Default values for dashboard cards */
const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
const twoMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 2));

/**
 * Calculates and returns the selected date and its symmetrical counterpart for dashboard display.
 *
 * @param selected - (Optional) The Date object representing the currently selected date. If undefined, defaults are used.
 *
 * @returns An object containing:
 *   - `selected`: The selected date (or default).
 *   - `symetrical`: The symmetrical date calculated based on the selected date (or default).
 *
 * @remark: If no date is selected, returns default dates (`oneMonthAgo` and `twoMonthsAgo`).
 */
export const getDashboardDates = (selected: Date | undefined) => {
    // if no date selected, use default
    if (!selected) return { selected: oneMonthAgo, symetrical: twoMonthsAgo };

    // compute dates
    const diff = new Date().getTime() - selected.getTime();
    const symetrical = new Date(selected.getTime() - diff);

    return { selected, symetrical };
};

export const getPeriodFormatted = (date: Date | undefined) => {
    if (!date) return "last month";

    const monthsDiff =
        (new Date().getFullYear() - date.getFullYear()) * 12 +
        (new Date().getMonth() - date.getMonth());

    if (monthsDiff >= 2) {
        return `last ${monthsDiff} months`;
    } else {
        const daysDiff = Math.floor(
            (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        return `last ${daysDiff} days`;
    }
};
