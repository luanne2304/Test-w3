import React from "react";

export const Transitem =(transaction)=>{
    return (
        <tr>
            <strong>#</strong>
            <p>Hash:{transaction.hash}</p>                  
            <p>From: {transaction.from}</p>
            <p>To:{transaction.to}</p>
            <p>Gas: {transaction.gas}</p>
            <p>Value: {transaction.value}</p>
        </tr>
    )
} 

