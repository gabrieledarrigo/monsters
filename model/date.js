/**
* DATE MODEL.
* Given a Date oBject return a date formatted 
* in the seguent format: dd/mm/yyyy
*/
var dateConverter = {
    convert: function(date) {
        var currentDate = typeof date !== 'undefined' ? new Date(date) : new Date();
        
        var day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
        var month = currentDate.getMonth() < 10 ? '0' + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
        var year = currentDate.getFullYear();

        return day + '/' + month + '/' + year;
    }
};

module.exports = dateConverter;