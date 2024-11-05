import React, { useState } from 'react';
import { ethers } from 'ethers';
import Transactions from './Transactions'; // ปรับเส้นทางให้ตรงกับที่เก็บสัญญา

const RefundComponent = ({ contractAddress }) => {
    const [transactionId, setTransactionId] = useState('');
    const [message, setMessage] = useState('');

    const requestRefund = async () => {
        if (!transactionId) {
            setMessage("กรุณาใส่หมายเลขธุรกรรมที่ถูกต้อง");
            return;
        }

        // เชื่อมต่อกับ MetaMask
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // สร้างอินสแตนซ์ของสัญญา
            const contract = new ethers.Contract(contractAddress, Transactions.abi, signer);

            try {
                const tx = await contract.requestRefund(transactionId);
                await tx.wait();
                setMessage("ขอคืนเงินเรียบร้อยแล้ว!");
            } catch (error) {
                console.error("Error requesting refund:", error);
                setMessage("เกิดข้อผิดพลาดในการขอคืนเงิน.");
            }
        } else {
            setMessage("กรุณาติดตั้ง MetaMask เพื่อใช้งานฟังก์ชันนี้.");
        }
    };

    return (
        <div>
            <h2>ขอคืนเงิน</h2>
            <input 
                type="number" 
                value={transactionId} 
                onChange={(e) => setTransactionId(e.target.value)} 
                placeholder="หมายเลขธุรกรรม" 
            />
            <button onClick={requestRefund}>ขอคืนเงิน</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RefundComponent;
