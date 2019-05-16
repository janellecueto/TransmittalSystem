/***********************************************************************************************************************
 *  Functions below this line are called on document ready for filling in and initializing values
 */

/**
 * insets the sheet size color and no color costs in the sheetSizes object for billplot/index.html
 * on document ready
 */
function setPrices(){
    $.ajax({
        type: "GET",
        url: "plottingPrices.php",
        data: {
            ret: 1
        },
        success: function(result){
            let data = JSON.parse(result);
            let index = 0;
            for(var key in sheetSizes){
                var colorCost = parseFloat(data[index][3].substring(1));
                var noColorCost = parseFloat(data[index+1][3].substring(1));
                sheetSizes[key].push(colorCost);
                sheetSizes[key].push(noColorCost);
                index += 2;
            }
            console.log(sheetSizes);
        },
        error: function(result){
            alert("error: "+result);
        }
    });
}

/***********************************************************************************************************************
 * Functions below are used on click for adding new rows
 */


/**
 * This onClick function adds a new item description row in transmittal/index
 */
$("#addNew").click(function(){
    let $addWrapper = $('#addWrapper');
    let newRow = $("<div>");
    newRow.addClass("row");

    let copiesDiv = $("<div>");
    copiesDiv.addClass("col-sm-2");
    let copiesInput = $("<input>");
    copiesInput.addClass("form-control form-control-sm num");
    copiesInput.attr({
        type: "text",
        name: "copies[]",
        placeholder: "Copies"
    });
    copiesDiv.append(copiesInput);
    newRow.append(copiesDiv);

    let datesDiv = $("<div>");
    datesDiv.addClass("col-sm-2");
    let datesInput = $("<input>");
    datesInput.addClass("form-control form-control-sm");
    datesInput.attr({
        type: "date",
        name: "dates[]",
    });
    datesDiv.append(datesInput);
    newRow.append(datesDiv);

    let numbersDiv = $("<div>");
    numbersDiv.addClass("col-sm-2");
    let numbersInput = $("<input>");
    numbersInput.addClass("form-control form-control-sm num");
    numbersInput.attr({
        type: "text",
        name: "numbers[]",
        placeholder: "Number"
    });
    numbersDiv.append(numbersInput);
    newRow.append(numbersDiv);

    let descriptDiv = $("<div>");
    descriptDiv.addClass("col-sm-6");
    let descInput = $("<input>");
    descInput.addClass("form-control form-control-sm");
    descInput.attr({
        type: "text",
        name: "descriptions[]",
        placeholder: "Description"
    });
    descriptDiv.append(descInput);
    newRow.append(descriptDiv);

    $addWrapper.append(newRow);
});

/**
 * This onClick function adds a new bill plot row in billplot/index
 */
$("#addRow").click(function(){
    let wrapper = $("#rowWrapper");
    let newRow = $("<tr>");

    let setsTd = $("<td>");
    let setsIn = $("<input>");
    setsIn.addClass("form-control form-control-sm num");
    setsIn.attr({
        type: "text",
        name: "numSets[]"
    });
    setsIn.mask("#");
    setsIn.change(updateLineTotal);
    setsTd.append(setsIn);
    newRow.append(setsTd);

    let sheetsTd = $("<td>");
    let sheetsIn = $("<input>");
    sheetsIn.addClass("form-control form-control-sm num");
    sheetsIn.attr({
        type: "text",
        name: "numSheets[]"
    });
    sheetsIn.mask("#");
    sheetsIn.change(updateLineTotal);
    sheetsTd.append(sheetsIn);
    newRow.append(sheetsTd);

    let sizeTd = $("<td>");
    let sizeIn = $("<select>");
    sizeIn.addClass("form-control form-control-sm");
    sizeIn.attr("name", "sheetSizes[]");
    for (var key in sheetSizes){
        sizeIn.append("<option value=\""+key+"\">"+sheetSizes[key][0]+"</option>");
    }
    sizeIn.change(updateLineTotal);
    sizeTd.append(sizeIn);
    newRow.append(sizeTd);

    let mediaTd = $("<td>");
    let mediaIn = $("<select>");
    mediaIn.addClass("form-control form-control-sm");
    mediaIn.attr("name", "mediaType[]");
    mediaIn.append("<option value=\"paper\">Paper</option>");
    mediaTd.append(mediaIn);
    newRow.append(mediaTd);

    let colorTd = $("<td>");
    colorTd.addClass("text-center");
    let colorIn = $("<input>");
    colorIn.addClass("form-check-input");
    colorIn.attr({
        type: "checkbox",
        name: "colored[]"
    });
    colorIn.change(updateLineTotal);
    colorTd.append(colorIn);
    newRow.append(colorTd);

    let costTd = $("<td>");
    let costIn = $("<input>");
    costIn.addClass("form-control form-control-sm money cost-money");
    costIn.attr({
        type: "text",
        name: "costs[]",
        placeholder: "$0.00",
        disabled: true
    });
    costTd.append(costIn);
    newRow.append(costTd);

    let lineTd = $("<td>");
    let lineIn = $("<input>");
    lineIn.addClass("form-control form-control-sm money total-money");
    lineIn.attr({
        type: "text",
        name: "lineTotals[]",
        placeholder: "$0.00",
        disabled: true
    });
    lineTd.append(lineIn);
    newRow.append(lineTd);

    wrapper.append(newRow);

});


/***********************************************************************************************************************
 * Functions below are called on change for auto filling client addresses
 */

/**
 *
 * @param {*} value - the job number or client code provided
 * @param {*} flag - flag denoting "jobNumber" or "clientCode"
 */
function addrFill(value, flag){
    $.ajax({
        type: "GET",
        url: "../php/fillAddress.php",
        data: {
            value: value,
            flag: flag
        },
        success: function(result){
            let data = JSON.parse(result);
            if(flag === "jobNumber"){
                $("#clientCode").val(data["clientCode"]);
                $("#clientNumber").val(data["clientNumber"]);

                let projStr = data["jn1"];
                if(data["jn2"]) projStr += data["jn2"];
                $("#project").text(projStr);
            }
            $("#company").val(data["company"]);
            $("#addr1").val(data["addr1"]);
            $("#addr2").val(data["addr2"]);
            $("#city").val(data["city"]);
            $("#state").val(data["state"]);
            $("#zip").val(data["zip"]);

            let clnames = $("#clientNames");
            data["names"].forEach(function(item){
                var opt = $("<option>");
                opt.val(item).text(item);
                clnames.append(opt);
            });

        },
        error: function(result){
            alert("error: "+result);
        }
    })
}

/**
 * 
 * @param {*} input jQuery <input> element
 * @param {*} value client code provided
 */
function copyToFill(input, value){
    $.ajax({
        type: "GET",
        url: "../php/fillAddress.php",
        data: {
            value: value,
            flag: "clientCode"
        },
        success: function(result){
            let data = JSON.parse(result);
            input.val(data["company"]);
            let clnames = $("#"+input.attr("data-list"));
            alert(input.attr("data-list"));
            data["names"].forEach(function(item){
                var opt = $("<option>");
                opt.val(item).text(item);
                clnames.append(opt);
            });
        },
        error: function(result){
            alert("error: "+result);
        }
    })
}

/**
 * 
 * @param {*} value - job number or client code provided
 * @param {*} flag - flag denoting "jobNumber" or "clientCode" (same usage as in fillAddr)
 */
function faxFill(value, flag){
    $.ajax({
        type: "GET",
        url: "../php/fillAddress.php",
        data: {
            value: value,
            flag: flag
        },
        success: function(result){
            let data = JSON.parse(result);
            if(flag === "jobNumber"){
                $("#clientCode").val(data["clientCode"]);

                let projStr = data["jn1"];
                if(data["jn2"]) projStr += data["jn2"];
                $("#project").text(projStr);
            }
            $("#company").val(data["company"]);
            $("#fax").val(data["fax"]);

            let clnames = $("#clientNames");
            data["names"].forEach(function(item){
                var opt = $("<option>");
                opt.val(item).text(item);
                clnames.append(opt);
             });
        }
    });
}
