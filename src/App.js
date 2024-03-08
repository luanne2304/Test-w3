import './App.css';
import Web3 from "web3";
import { useState, useEffect} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract} from "./utils/load-contracts"

function App(){
  const[web3Api, setWeb3Api]= useState({
    provider: null,
    web3:null,
    contract:null,
  })

  const loadBalance = async () => {
    const { contract, web3 } = web3Api
    const balance = await web3.eth.getBalance(account)
    setBalance(web3.utils.fromWei(balance, "ether"))

  }

  const [account,setAccount]= useState(null)
  const [balance,setBalance]= useState(null)

  async function IsMeta (){
    const checkMeta =await detectEthereumProvider();
    if(checkMeta!= null)
    {
      web3Api.provider.request({method:"eth_requestAccounts"})
    }
    else {
      alert("Vui lòng thêm extension Metamask")
    }
  }
  


  useEffect(()=>{
    const loadProvider=async ()=> {
      const provider=await detectEthereumProvider();
      const contract = await loadContract("Testcontract",provider);
      if(provider){

        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }
      else{
        console.error("pls, i Metamask")
      }
    }
    loadProvider()
  },[])

  useEffect(()=>{
    const getAccount = async ()=>{
      
      const accounts= await web3Api.web3.eth.getAccounts()
      // const balance= await web3Api.web3.eth.getBalance(accounts[3])
      // setBalance(balance)     
      setAccount(accounts[0])

    }
    web3Api.web3 && getAccount()
  },[web3Api.web3]);

  useEffect(() => {
    if(account != null){
      web3Api.contract && loadBalance()
    }
  }, [account]);

  return (
    <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
      <div className='d-inline-block '>
        <h3 className='m-2'>
          Ví: <strong>{balance?balance: "0"}</strong>
        </h3> 
        <button type="button" class="m-2 btn btn-info">Info</button>  
        <button type="button" class="m-2 btn btn-danger">Danger</button>
        <button onClick={IsMeta} type="button" class="m-2 btn btn-dark">Kết lối</button>  
        <span className='d-block '>Address: <strong>{account?account: "Nan"}</strong></span>  
      </div>
    </div>
  );
}


export default App;
