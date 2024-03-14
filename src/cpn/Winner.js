import React from "react";

export const Winner =({item})=>{
    if (item=="") {
        return (
            <div>
                <h3>Chưa kết thúc phiên</h3>
            </div>
        )}
    else{
        return (
            <div>
                <p>aa</p>
                <h3>{item.address}</h3>
                <h3>{item.amount}</h3>
            </div>
        );
    }
}

