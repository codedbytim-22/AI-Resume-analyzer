<?php
// mpesa_gateway.php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
date_default_timezone_set('Africa/Nairobi');

// Only run if the request came from our Javascript fetch call
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['initiate_mpesa'])) {
    
    // 1. Get data from the frontend
    $phone = filter_var($_POST['phone'], FILTER_SANITIZE_NUMBER_INT);
    $amount = filter_var($_POST['amount'], FILTER_VALIDATE_INT) ?: 1;

    // Basic validation
    if (empty($phone) || strlen($phone) < 10) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid phone number format.']);
        exit;
    }

    // Safaricom Sandbox Credentials
    $consumerKey = 'T2Rt3zLgO20r6pTuWDRSThC1YM311NPN'; 
    $consumerSecret = 'NX6xgyPjQbQ3a1vC'; 
    $BusinessShortCode = '174379';
    $Passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    
    // Even though we aren't handling it, Safaricom requires a valid URL format here
    $CallBackURL = 'https://callback.kenova.co'; 
    
    $Timestamp = date('YmdHis');
    $Password = base64_encode($BusinessShortCode . $Passkey . $Timestamp);

    //Authenticate with Safaricom to get the Access Token
    $ch = curl_init('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_USERPWD, $consumerKey . ':' . $consumerSecret);
    $token_response = json_decode(curl_exec($ch));
    $token = $token_response
    ->access_token ?? null;
    curl_close($ch);

    if (!$token) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to connect to Safaricom Sandbox.']);
        exit;
    }

    // 4. Prepare the STK Push Request
    $stk_data = [
        'BusinessShortCode' => $BusinessShortCode,
        'Password' => $Password,
        'Timestamp' => $Timestamp,
        'TransactionType' => 'CustomerPayBillOnline',
        'Amount' => $amount,
        'PartyA' => $phone,
        'PartyB' => $BusinessShortCode,
        'PhoneNumber' => $phone,
        'CallBackURL' => $CallBackURL,
        'AccountReference' => "ResumeAnalyzer",
        'TransactionDesc' => "Premium Activation"
    ];

    // 5. Send the STK Push Request to Safaricom
    $ch = curl_init('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json', 'Authorization:Bearer ' . $token]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($stk_data));
    $response = json_decode(curl_exec($ch));
    curl_close($ch);

    // 6. Send the result back to your HTML Modal
    if (isset($response->ResponseCode) && $response->ResponseCode == "0") {
        echo json_encode(['status' => 'success', 'message' => 'Prompt sent to your phone! Enter your PIN.']);
    } else {
        // Capture Safaricom's specific error message if it fails (e.g., invalid number)
        $err_msg = $response->errorMessage ?? 'Failed to initiate STK Push.';
        echo json_encode(['status' => 'error', 'message' => 'Safaricom Error: ' . $err_msg]);
    }

} else {
    // If someone tries to access this file directly in their browser
    echo json_encode(['status' => 'error', 'message' => 'Invalid Request Method.']);
}
?>