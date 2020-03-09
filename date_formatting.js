// All the months of the year
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"];

// Formats a Data object as an easy-to-read string
exports.format = function(date) {
    let str = "";
    str += months[date.getMonth()];
    str += " " + date.getDate().toString();
    if (date.getDate() % 10 === 1 && date.getDate() !== 11) {
        str += "st";
    } else if (date.getDate() % 10 === 2 && date.getDate() !== 12) {
        str += "nd";
    } else if (date.getDate() % 10 === 3 && date.getDate() !== 13) {
        str += "rd";
    } else {
        str += "th";
    }
    return str;
};