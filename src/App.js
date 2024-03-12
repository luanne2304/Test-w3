import './App.css';
import Web3, { LimitExceededError } from "web3";
import axios from 'axios';
import { useState, useEffect} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract} from "./utils/load-contracts"
import {Transitem } from  "./cpn/Transitem"

function App(){
  const[web3Api, setWeb3Api]= useState({
    provider: null,
    web3:null,
    contract:null,
  })

  // const[transInfo,setTransInfo ]= useState({
  //   rfrom: "",
  //   rto:"",
  //   rgasused:"",
  //   rvalue:"",
  //   rtransactionhash:"",
  // })

  const[ListtransInfo, setListTransInfo]= useState([])


  const [account,setAccount]= useState(null)
  const [balance,setBalance]= useState(null)

  const [shouldReload, reload] = useState(false);
  const reloadEffect = () => reload(!shouldReload)


  const loadBalance = async () => {
    const { contract, web3 } = web3Api
    const balance = await web3.eth.getBalance(account)
    setBalance(web3.utils.fromWei(balance, "ether"))

  }

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
  
  window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload();
    }
);

    async function Trans(){

      var receiverAddress = document.getElementsByName("address")[0].value;
      var value = document.getElementsByName("amount")[0].value;
      if (receiverAddress.trim() === "" || value.trim() === "") {
        alert("Vui lòng nhập thông tin đầy đủ");
        return;
    }


    let transactionSendinfo= await web3Api.web3.eth.sendTransaction({
        to: receiverAddress,
        from: account,
        value: value
    })    

    const transInfo4API ={
      From: transactionSendinfo.from,
      To:transactionSendinfo.to,
      Gasused:transactionSendinfo.gasUsed.toString(),
      Value: web3Api.web3.utils.fromWei(value, "ether"),
      Transactionhash:transactionSendinfo.transactionHash,
    };
    debugger
    try {
      const response = await axios.post('http://localhost:5000/posttrans', transInfo4API);
      console.log("ok")

      debugger
    } catch (error) {
      console.error('Error:', error);
      // Xử lý lỗi tại đây
    }

  }
   
  function test(){
    console.log()
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
    <div>
      <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh' }}>
        <div className='d-inline-block '>
          <h3 className='m-2'>
            Ví: <strong>{balance?balance: "0"}</strong>
          </h3> 
          <div class="input-group mb-3 input-group-sm">
            <span class="input-group-text">Địa chỉ nhận</span>
            <input type="text" name='address' class="form-control"></input>
          </div>
          <div class="input-group mb-3 input-group-sm">
            <span class="input-group-text">Số lượng</span>
            <input type="text" name='amount' class="form-control"></input>
          </div>
          <button onClick={Trans} type="button" class="m-2 btn btn-info">Gửi</button>  

          <button onClick={test} type="button" class="m-2 btn btn-info">Test</button> 
          <button  type="button" class="m-2 btn btn-danger" data-bs-toggle="modal" data-bs-target="#myModal">Lịch sử</button>
          <button onClick={IsMeta} type="button" class="m-2 btn btn-dark">Kết lối</button>  
          <span className='d-block '>Address: <strong>{account?account: "Nan"}</strong></span>  
        </div>
      </div>

      <div class="modal" id="myModal">
        <div class="modal-dialog" style={{maxWidth: '50%'}}>
          <div class="modal-content">


            <div class="modal-header">
              <h4 class="modal-title">Lịch sự giao dịch</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>


            <div class="modal-body">
              <table variant="simple">
                <thead>
                  <th>
                    Các giao dịch thành công
                  </th>
                </thead>
                <tbody>
                  {ListtransInfo.map((transInfoitem, index) => (
                      <Transitem key={index} transaction={transInfoitem} />
                  ))}
                  {/* <tr>
                      <strong>#</strong>
                      <p>Hash: 0x1d77cc5fc0b7af10a8711e93ae794d9895ec359a135246f25d8edf889f29fd05</p>                  
                      <p>From: 0x6E9918f26732C10f2C1fbB754506AF0B4700403C</p>
                      <p>To: 0x953A69BA6Dbc5a98b4CeCEdA7161cC2e4534E26a</p>
                      <p>Gas: 21000</p>
                      <p>Value: 3.0 ETH</p>
                  </tr> */}
                </tbody>
              </table>
            </div>


            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}


export default App;
