<?php
// trigger_mpesa.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *"); // Allows your HTML to talk to this file
date_default_timezone_set('Africa/Nairobi');

if (isset($_POST['phone'])) {
    $phone = filter_var($_POST['phone'], FILTER_SANITIZE_NUMBER_INT);
    $amount = 1; // Hardcoded to 1 bob for testing

    // Your Credentials
    $consumerKey = 'T2Rt3zLgO20r6pTuWDRSThC1YM311NPN'; 
    $consumerSecret = 'NX6xgyPjQbQ3a1vC'; 
    $BusinessShortCode = '174379';
    $Passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    $Timestamp = date('YmdHis');
    $Password = base64_encode($BusinessShortCode . $Passkey . $Timestamp);

    // 1. Get Token
    $ch = curl_init('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERPWD, $consumerKey . ':' . $consumerSecret);
    $token = json_decode(curl_exec($ch))->access_token ?? null;
    curl_close($ch);

    if (!$token) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to connect to Safaricom.']);
        exit;
    }

    // 2. Send STK Push
    $stk_data = [
        'BusinessShortCode' => $BusinessShortCode,
        'Password' => $Password,
        'Timestamp' => $Timestamp,
        'TransactionType' => 'CustomerPayBillOnline',
        'Amount' => $amount,
        'PartyA' => $phone,
        'PartyB' => $BusinessShortCode,
        'PhoneNumber' => $phone,
        'CallBackURL' => 'https://example.com/ignored', // We don't care about the callback right now
        'AccountReference' => "Test",
        'TransactionDesc' => "Test"
    ];

    $ch = curl_init('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json', 'Authorization:Bearer ' . $token]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($stk_data));
    $response = json_decode(curl_exec($ch));
    curl_close($ch);

    // 3. Tell the HTML it worked
    if (isset($response->ResponseCode) && $response->ResponseCode == "0") {
        echo json_encode(['status' => 'success', 'message' => 'Prompt sent to your phone!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed: ' . ($response->errorMessage ?? 'Unknown error')]);
    }
}
?>