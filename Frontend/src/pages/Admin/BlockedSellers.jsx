import React,{useState,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import NavigationBar from "../../components/navbarAdmin/Navbar";
import Sidebar from '../../components/navbarAdmin/Sidebar'
import "./style.css";

function BlockedSellers() {
  const [toggle, setToggle] = useState(true)    
  const Toggle = () => {setToggle(!toggle)}  
  const [AllSeller,setAllSeller]=useState([]);
  function blockSeller(i){
    let token=localStorage.getItem("token");
    fetch("http://localhost:3000/unblock_seller", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({token:token,id:AllSeller[i].seller_id}),
    }).then((res)=>{
        if(res.status===200){
            setAllSeller(
                AllSeller.filter((item,index)=>{
                    return index!==i;
                })
            )
        }
    })
}
    useEffect(()=>{
        let token=localStorage.getItem("token");
        fetch("http://localhost:3000/blocked_seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({token}),
        })
        .then((res) => {
            if (res.status !== 200){
            throw res;
            } else {
            return res.json();
            }
        })
        .then((data) => {
           
            if(data.length!=0){
                setAllSeller([...data]);
            }else{
                setPage(page-1);
            }
        })
        .catch((err) => {
            if(err.status===401){
                err.json()
                .then((data)=>{
                    if(data.error==='unauthorized' || data.error==='/fail'){
                        window.Location.href='/';
                    }else if(data.error==='NotVerified'){
                        window.location.href='/Notverified'
                    }
                })
            }else{
                throw new Error(err.status);
            }
        });
    },[]);
  return (
    <div className='container-fluid bg-secondary min-vh-100 '>
    <div className='row '>
      {toggle && <div className='col-4 col-md-2 bg-white vh-100 position-fixed'><Sidebar /></div>}
      {toggle &&  <div className='col-4 col-md-2'></div>}
      <div className='col'>
            <div className="px-3">
                <NavigationBar Toggle={Toggle} />
                <span className="text-white fs-4">Blocked Sellers</span>
            </div>
            <div className="px-3" style={{height:"82vh",overflowY: 'scroll'}}>
            <table class="table caption-top bg-white rounded mt-2" >
                <thead>
                <tr>
                    <th scope="col">#</th>
                    {/* <th scope="col">Image</th> */}
                    <th scope="col">Username</th>
                    <th scope="col">Name</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Aadhar No.</th>
                    <th scope="col">Address</th>
                    <th scope="col">Action</th>

                </tr>
                </thead>
                <tbody>
                    {
                        AllSeller.map((item,index)=>{
                            return(
                                <>
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        {/* <td><img className="mt-2" src={`http://localhost:3000/${item.image}`} style={{height: "200px",width: "200px"}}/></td> */}
                                        <td>{item.username}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.mobile_number}</td>
                                        <td>{item.aadhar_number}</td>
                                        <td>{item.address}</td>
                                        <td><button className="btn btn-danger" onClick={()=>blockSeller(index)}>unblock</button></td>
                                    </tr>
                                </>
                            )
                        })
                    }
                </tbody>
            </table>
            </div>
      </div>
    </div>
  </div>

  );
}
export default BlockedSellers;
