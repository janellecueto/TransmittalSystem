<?php

require_once("../assets/php/info.php");
include("../assets/php/current.php");
include_once("../assets/php/createPDF.php");

$debug = false;

$jobNumber = $_POST['jobNumber'];
$clientCode = $_POST['clientCode'];
$date = new DateTime($_POST['date']);

$attention = $_POST['attention'];
$company = $_POST['company'];
$fax = $_POST['fax'];
$from = $_POST['from'];

$project = $_POST['project'];

$numPages = $_POST['numPages'];
$willFollow = $_POST['willFollow'];

$remarks = $_POST['remarks'];

$extraComp = $_POST['extraComp'];
$extraName = $_POST['extraName'];
$extraFax = $_POST['extraFax'];

// $save = $_POST['save'];

$conn = new mysqli($host, $user, $password, $defaultTbl);
if($conn->errno){
    echo "Error: ".$conn->error();
    exit();
}

$mainQuery = "INSERT INTO $defaultTbl.$faxTbl (`Date`, Code, Company, Jn, Project, Attention, FaxNumber, NumberPages, ";
$values = " VALUES('".$date->format("Y-m-d")."', '$clientCode', '".str_replace("'", '"', $company)."', '$jobNumber', '".str_replace("'", '"', $project)."', '".str_replace("'", '"', $attention)."', '$fax', $numPages, ";
if($remarks){
    $mainQuery .= "Remarks, ";
    $values .= "'".str_replace("'", '"', $remarks)."',";
}
$mainQuery .= "Signed";
$values .= "'$from'";
$mainQuery .= ", WillFollow";
if($willFollow){
    $values .= ','.true;
}
else{
    $values .= ', 0';
}
for($i=1; $i<= 2; $i++){
    if($extraComp[$i-1]){
        $mainQuery .= ", Copy_".$i."_Who";
        $values .= ', "'.$extraName[$i-1].'"';
        $mainQuery .= ", Copy_".$i."_Co";
        $values .= ', "'.$extraComp[$i-1].'"';
        $mainQuery .= ", Copy_".$i."_Fax";
        $values .= ', "'.$extraFax[$i-1].'"';
    }
}
$mainQuery .= ')';
$values .= ')';
$mainQuery .= $values;

//echo $mainQuery;
if(!$debug){
    if($conn->query($mainQuery)){
        echo "Fax Transmittal saved<br>";
    }
    else{
        echo "ERROR: ".$conn->error."<br>".$mainQuery."<br><b>Form data NOT saved in db.</b>";
    }
}
else{
    echo $mainQuery."<br>";
}

mysqli_close($conn);

// $mainPdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
faxPDF();

//print copy tos 

for($i = 0; $i < 2; $i++){
    if($extraComp[$i]){
        $company = $extraComp[$i];
        $attention = $extraname[$i];
        $fax = $extraFax[$i];
        faxPDF();
    }
}