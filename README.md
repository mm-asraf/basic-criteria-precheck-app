# User Verification API

## Overview

This API endpoint is designed for user verification. You can test this endpoint locally to verify user information.

## Endpoint
POST http://localhost:4566/user-e-verification

## Request Body

Send a POST request with the following JSON payload:

```json
{
  "firstName": "Harshad",
  "lastName": "Mehta",
  "email": "mehtagmail.com",
  "aadhaar": "345637863268",
  "dob": "12/10/2005"
}
