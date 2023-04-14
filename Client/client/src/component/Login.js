import {useContext,useRef,useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {loginContext,idContext} from "../context/idContext";
import styles from "../login.module.css"

export default function Login(){
    const [userData,setUserData] = useState({id:'',password:'',name:'',weight:0,height:0});
    const idRef = useRef(null);
    const passwordRef = useRef(null);
    const nav = useNavigate();
    const {id,setId} = useContext(idContext);
    const [heigh,setHeight] = useState(0);
    const {login,setLogin} = useContext(loginContext);
    
    function doLogin(e){
        e.preventDefault(); 
        fetch('http://localhost:4000/api/login',{
            method:"POST",
            headers:{
            "Content-Type":"application/json"   
        },
        body:JSON.stringify({
            id:idRef.current.value,
            password:passwordRef.current.value,
            height:0,
            weight:0
        })
        }).catch((err)=>{
            alert("아이디 또는 비밀번호가 틀렸습니다.");
        })
        .then(res=> res.json())
        .then(user=>{  
            console.log(user);
            setId(`${user.id}`);
            setLogin(true);
            setHeight(user.height);
            setUserData(user);
            localStorage.setItem('userId',user.id);
            localStorage.setItem('name',user.name);
            localStorage.setItem('height',user.height);
            localStorage.setItem('weight',user.weight);
            
            console.log(user.height);
            alert(`${user.id}님 로그인`);
            if(user.height===0)
            {
                nav(`/id/${user.id}/hw_input`);
            }else{
                nav(`/id/${user.id}`);
            }
            
        
        })
    }

    return(
        <div id={styles.login}>
            
            <form className={styles.login_form} onSubmit={doLogin}>
            <h1 className={styles.login_h1}>LOGIN</h1>
            <p><input className={styles.login_input} type="text" placeholder="ID" ref={idRef}/></p>
            <p><input className={styles.login_input} type="password" placeholder="PASSWORD" ref={passwordRef}/></p>
            <p><input className={styles.login_input} type="submit" value="로그인"/></p>
            </form>
        </div>
    )
}