var express = require('express');
var router = express.Router();
const db = require('../lib/db');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/
router.get('/',(req,res)=>{
  
  db.query(`SELECT *FROM User`,(err,user)=>{
    if(err) throw err;
    console.log(user);
    res.send(`<p><a href="/api/register">테스트1</a></p>`);
  }); 
});

router.get('/a',(req,res)=>{
  db.query(`SELECT *FROM User`,(err,user)=>{
    console.log(user);
    res.send(`<p>테스트2</p>`);
  });
});


router.post('/api/register',(req,res)=>{
  const {id,password,name,height,weight,gender,age} = req.body
  
  db.query(`INSERT INTO user (id,password,name,height,weight,gender,age) VALUES(?,?,?,?,?,?,?)`,[id,password,name,height,weight,gender,age],
  (err,result)=>{
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }else {
      res.status(200).send('Success');
    }
  })
});

router.post('/api/login',(req,res)=>{
  const {id,password,name,height,weight} = req.body;
  db.query('SELECT *FROM User WHERE id=?',[id],(err,userData)=>{
    if(err){
      console.error(err);
      res.status(500).send('Internal Server Error');
    }else if(!userData[0].id||userData.length ===0){
      res.status(401).json({message:'아이디 또는 비밀번호가 가 틀렸습니다.'});
    }else if(userData[0].password !== password){
      req.status(401).json({message:'아이디 또는 비밀번호가 가 틀렸습니다.'});
    }
    else{
      res.json({id:userData[0].id,name:userData[0].name,height:userData[0].height,weight:userData[0].weight});
    }
  });
});

router.get('/api/login', (req, res) => {  
  res.send('Login page');
});

router.post('/api/hw_input',(req,res)=>{
  const {id,height,weight,basal} = req.body;
  db.query('UPDATE User SET height=?,weight=?,basal=? WHERE id=?',[height,weight,basal,id],(err,userData)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  });
});

router.post('/api/w_input',(req,res)=>{
  const {id,weight,basal} = req.body;
  db.query('UPDATE User SET weight=?,basal=? WHERE id=?',[weight,basal,id],(err,userData)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  });
});

router.post('/api/weight_change',(req,res)=>{
  const {id,weight,date} = req.body;
  db.query('SELECT *FROM weight WHERE date=?',[date],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      if(result.length>0){
        db.query('UPDATE weight SET weight=? WHERE weight_id=? AND date=?',[weight,id,date],(err2,result)=>{
          if(err2){
            console.log(err2);
            res.status(500).send('Internal Server Error');
          }else{
            res.status(200).send('Success');
          }
        })
      }else{
        db.query('INSERT INTO weight (weight_id,weight,date) VALUES(?,?,?)',[id,weight,date],(err3)=>{
          if(err3){
            console.log(err3);
            res.status(500).send('Internal Server Error');
          }else{
            res.status(200).send('Success');
          }
        });
      }
    }
  });
});

router.post('/api/food',(req,res)=>{
  const {user_id,meal_time,food,food_type,serving_size,kcl,carbo,protein,fat,date} = req.body;
  console.log(req.body);
  db.query('INSERT INTO Diet (user_id,meal_time,food,food_type,serving_size,kcl,carbo,protein,fat,date) VALUES (?,?,?,?,?,?,?,?,?,?)',
  [user_id,meal_time,food,food_type,serving_size,kcl,carbo,protein,fat,date],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  });
});

router.post('/api/food_search',(req,res)=>{
  const {search} = req.body;
  db.query('SELECT food_code,food_name,food_type,serving_size,kcal,protein,fat,carbo FROM food WHERE food_name LIKE ?',[search],
  (err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else
      res.json(result);
  });
});

router.post('/api/breakfast_list',(req,res)=>{
  const {user_id,meal_time,date} = req.body;
  db.query('SELECT food,meal_time,food_type,serving_size,kcl,protein,fat,carbo,diet_num FROM diet WHERE user_id=? AND meal_time = ? AND date = ?',[user_id,meal_time,date],
  (err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    }
  });
})

router.post('/api/diet_delete',(req,res)=>{
  const {user_id,meal_time,diet_num,date} = req.body;
  db.query('DELETE FROM diet WHERE user_id=? AND meal_time=? AND diet_num=? AND date=?',[user_id,meal_time,diet_num,date],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  });
});

router.post('/api/weight_list',(req,res)=>{
  const id = req.body.id;
  db.query('SELECT *FROM weight WHERE weight_id=?',[id],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    }
  })
})

router.post('/api/diet_detail',(req,res)=>{
  const {id,meal_time,date} = req.body;
  db.query('SELECT food,meal_time,food_type,serving_size,kcl,protein,fat,carbo,diet_num FROM diet WHERE user_id=? AND meal_time=? AND date=?'
  ,[id,meal_time,date],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    }
  });
});

router.post('/api/myInfo',(req,res)=>{
  const id = req.body.id;
  db.query('SELECT *FROM user WHERE id=?',[id],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result[0]);
    }
  });
});

router.post('/api/week_weight',(req,res)=>{
  const {weight_id,date} = req.body;
  db.query('SELECT *FROM weight WHERE weight_id=? AND date=?',[weight_id,date],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else if(result.length===0){
      db.query('SELECT *FROM weight WHERE weight_id=? AND date>=? ORDER BY date LIMIT 1',[weight_id,date],(err,result)=>{
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          res.json(result[0]);
        }
      })
    }
    else{
      res.json(result[0]);
    }
  });
});

router.post('/api/cardio',(req,res)=>{
  const {cardio_id,cardio_name,duration,date} = req.body;
  db.query('INSERT INTO cardio_workout (cardio_id,cardio_name,duration,date) VALUES(?,?,?,?)',[cardio_id,cardio_name,duration,date],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  });
});

router.post('/api/resistance',(req,res)=>{
  const {resistance_id,resistance_name,weight,reps,sets,date} =req.body;
  db.query('INSERT INTO resistance_workout (resistance_id,resistance_name,weight,reps,sets,date) VALUES(?,?,?,?,?,?)',[resistance_id,resistance_name,weight,reps,sets,date]
  ,(err)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  });
});

router.post('/api/cardio_list',(req,res)=>{
  const {cardio_id,date} = req.body;
  db.query('SELECT *FROM cardio_workout WHERE date=? AND cardio_id=?',[date,cardio_id],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    }
  });
});

router.post('/api/resistance_list',(req,res)=>{
  const {resistance_id,date} = req.body;
  db.query('SELECT *FROM resistance_workout WHERE date=? AND resistance_id=?',[date,resistance_id],(err,result)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    }
  });
});

router.post('/api/weekly_cardio',(req,res)=>{
  const {userId,monday,current} = req.body;
  db.query('SELECT date FROM cardio_workout WHERE cardio_id=? AND date>=? AND date<=?',[userId,monday,current],(err,result)=>{
    if(err)
    {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    } 
  });
})

router.post('/api/weekly_resistance',(req,res)=>{
  const {userId,monday,current} = req.body;
  db.query('SELECT date FROM resistance_workout WHERE resistance_id=? AND date>=? AND date<=?',[userId,monday,current],(err,result)=>{
    if(err)
    {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.json(result);
    } 
  });
})

router.post('/api/target_weight',(req,res)=>{
  const {id,target_weight} = req.body;
  db.query('UPDATE user SET target_weight=? WHERE id=?',[target_weight,id],(err2)=>{
    if(err2){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  })
});

router.post('/api/activity',(req,res)=>{
  const {id,activity} = req.body;
  db.query('UPDATE user SET activity=? WHERE id=?',[activity,id],(err)=>{
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.status(200).send('Success');
    }
  })
})


module.exports = router;
