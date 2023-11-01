
const express = require("express");
const app = express();
const db = require(`../models/connect.js`);
const port = 9090;
app.use(express.json());

let userloggedin=null

app.get('/home', async (req, res) => {
    try {
      let result = await db.query(`SELECT * from users`);
      res.json(result.rows);
    }
    catch (err) {
      console.error(err);
      res.status(500).send('error in get the home');
    }
});


app.get('/services', async (req, res) => {
    try {
      let result = await db.query(`SELECT * from services`);
      res.json(result.rows);
    }
    catch (err) {
      console.error(err);
      res.status(500).send('error in get the home');
    }
});










app.post('/addorderhouse', async (req, res) => {
  const {number_rooms,number_bathrooms,clean_type,recurring,date,time,city_name} = req.body;
  try {
      const query = `
          INSERT INTO house_order (number_rooms,number_bathrooms,clean_type,
            recurring,date,time,id_user,city_name)
          VALUES ($1, $2, $3,$4,$5,$6,$7,$8)
          RETURNING id`;
      const values = [number_rooms,number_bathrooms,clean_type,recurring,date,time,userloggedin,city_name];
      if(userloggedin!=null){
           const result = await db.query(query, values);
           const newOrderId = result.rows[0].order_id;
           res.status(201).json({ message: 'The order added successfully', order_id : newOrderId });
      }
      else{
          res.json("The user is not login")
      }
  } catch (error) {
      console.error('Error adding blog:', error);
      res.status(500).json({ error: 'Failed to add the blog' });
  }
});




app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user data from the database based on the provided email
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check user type and redirect accordingly
    if (user.id_user_type === 1) {
      return res.send("This is the admin page");
    } else if (user.id_user_type === 2) {
      return res.send("This is the end users page");
    } else if (user.id_user_type === 3) {
      return res.send("This is the super admins page");
    } else {
      return res.send("This is the default page");
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});









app.post('/add_order_office', async (req, res) => {
  const {full_name,phone_number,business_name,no_employee,square_footage,city_name} = req.body;
  try {
      const query = `
          INSERT INTO office_order (full_name,phone_number,business_name,no_employee,square_footage,id_user,city_name)
          VALUES ($1, $2, $3,$4,$5,$6,$7)
          RETURNING id`;
      const values = [full_name,phone_number,business_name,no_employee,square_footage,userloggedin,city_name];
      if(userloggedin!=null){
           const result = await db.query(query, values);
           const newBlogId = result.rows[0].blog_id;
           res.status(201).json({ message: 'order office added successfully', blog_id : newBlogId });
      }
      else{
          res.json("The user is not login")
      }
  } catch (error) {
      console.error('Error adding blog:', error);
      res.status(500).json({ error: 'Failed to add the blog' });
  }
});




app.get('/ourteams', async (req, res) => {
    try {
      let result = await db.query(`SELECT * from our_teams`);
      res.json(result.rows);
    }
    catch (err) {
      console.error(err);
      res.status(500).send('error in get the home');
    }
});






app.post('/signup', async(req, res) => {
  const {name,email,phone,password} = req.body;
  try{
      const query = `INSERT INTO users (name, email,phone,password)
                          VALUES ($1, $2, $3,$4)
                          RETURNING id`;
      const values = [name, email,phone, password];
      let pattern = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
      if (name.length < 6){
          res.json("very short name, add more then 3 characters");
      } else if (!pattern.test(email)){
          res.json("your email is not valid!");
      } else if (password.length < 8){
          res.json("very short password, add more then 8 characters");
      } else {
          const result = await db.query(query, values);
          const newUserId = result.rows[0].id;
          res.status(201).json({ message: 'User added successfully', user_id: newUserId });
      }
  } catch (error){
      console.error('Failed to register : ', error);
      res.status(500).json({ error: 'Failed to register'});
  };
});





app.get('/login', async(req, res) => {
  const {email, password} = req.body;
  try{
      const query = `select * from users where email=$1 and password=$2
      `;
      const values = [email, password];
      const result = await db.query(query, values);
    const theUser=result.rows[0];
    if(theUser.email==email&& theUser.password==password){
      userloggedin=theUser.id
      res.json("The user is found")
    }
  } catch (error){
      console.error('Failed to login : ', error);
      res.status(500).json({ error: 'Failed to login'});
  };
});







app.get('/customers', async (req, res) => {
    try {
      let result = await db.query(`SELECT * from customer`);
      res.json(result.rows);
    }
    catch (err) {
      console.error(err);
      res.status(500).send('error in get the home');
    }
});



app.get('/list_cleanning', async (req, res) => {
  try {
    let result = await db.query(`SELECT * from list_of_cleaning`);
    res.json(result.rows);
  }
  catch (err) {
    console.error(err);
    res.status(500).send('error in get the home');
  }
});


app.get('/name_cleaning', async (req, res) => {
  try {
    let result = await db.query(`SELECT * from name_cleaning`);
    res.json(result.rows);
  }
  catch (err) {
    console.error(err);
    res.status(500).send('error in get the home');
  }
});




app.get('/img_services/:id_service', async(req, res) => {
    try{
        const query = 'select * from images_services where id_service = $1';
        const id_service = req.params.id_service;
        const result = await db.query(query, [id_service]); 
        res.json(result.rows);
    } catch (error){
        console.error('Failed to get one blog: ', error);
        res.status(500).json({ error: 'Failed to get one blog'});
    }
  });




  app.get('/confirm_info/:id_user', async(req, res) => {
    try{
        const query = 'select * from house_order where id_user = $1';
        const id_user= req.params.id_user;
        const result = await db.query(query, [id_user]); 
        res.json(result.rows);
    } catch (error){
        console.error('Failed to get one the summary for this user: ', error);
        res.status(500).json({ error: 'Failed to get the summary for this user'});
    }
  });








  app.get('/name_clean/:id_list_cleaning', async(req, res) => {
    try{
        const query = 'select * from name_cleaning where id_listcleaning = $1';
        const  id_list_cleaning= req.params.id_list_cleaning;
        const result = await db.query(query, [id_list_cleaning]); 
        res.json(result.rows);
    } catch (error){
        console.error('Failed to get one blog: ', error);
        res.status(500).json({ error: 'Failed to get one blog'});
    }
  });



  


app.get('/cleanix_blog', async (req, res) => {
    try {
      let result = await db.query(`SELECT * from cleannex_blog`);
      res.json(result.rows);
    }
    catch (err) {
      console.error(err);
      res.status(500).send('error in get the home');
    }
});




app.get('/getservices/:id', async(req, res) => {
    try{
        const query = 'select * from services where id = $1';
        const id = req.params.id;
        const result = await db.query(query, [id]); 
        res.json(result.rows);
    } catch (error){
        console.error('Failed to get one blog: ', error);
        res.status(500).json({ error: 'Failed to get one blog'});
    }
});




app.get('/getservices/:id', async(req, res) => {
  try{
      const query = 'select * from services where id = $1';
      const id = req.params.id;
      const result = await db.query(query, [id]); 
      res.json(result.rows);
  } catch (error){
      console.error('Failed to get one blog: ', error);
      res.status(500).json({ error: 'Failed to get one blog'});
  }
});




app.get('/img_ser/:id_service', async(req, res) => {
    try{
        const query = 'select * from images_services where id_service = $1';
        const id_service = req.params.id_service;
        const result = await db.query(query, [id_service]); 
        console.log(result)
        res.json(result.rows);
    } catch (error){
        console.error('Failed to get one blog: ', error);
        res.status(500).json({ error: 'Failed to get one blog'});
    }
});







// Middleware to verify the JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization; // Assuming you send the token in the request headers

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId; // Add the user ID to the request object
    next();
  });
}

// Add a new comment route with authentication middleware
app.post('/add_new_comment', verifyToken, async (req, res) => {
  const { name_person, job_person, title_comment, des_comment } = req.body;
  const id_user = req.userId; // Get the user ID from the request object

  try {
    const query = `
      INSERT INTO feedbacks (name_person, job_person, title_comment, des_comment, id_user)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`;
    const values = [name_person, job_person, title_comment, des_comment, id_user];
    const result = await db.query(query, values);
    const newCommentId = result.rows[0].id;
    res.status(201).json({ message: 'Adding new comment is successful', comment_id: newCommentId });
  } catch (error) {
    console.error('Failed to add a new comment:', error);
    res.status(500).json({ error: 'Failed to add a new comment' });
  }
});










app.post('/add_order_house', async (req, res) => {
  const { n_roome, n_bathroome, clean_type,recurring,date,time,city_name} = req.body;
  try {

      const query = `INSERT INTO house_order(n_roome, n_bathroome, clean_type,recurring,date,time,city_name)
                    VALUES ($1, $2, $3, $4,$5,$6)
                    RETURNING id`;
      const values = [n_roome, n_bathroome, clean_type,recurring,date,time,city_name];
      const result = await db.query(query, values);
      const newUserId = result.rows[0].id;
      res.status(201).json({ message: 'Adding order school successfully', user_id: newUserId });
  } catch (error) {
      console.error('Failed to register:', error);
      res.status(500).json({ error: 'Failed to register' });
  }
});





app.post('/add_order_school', async (req, res) => {
  const {number_rooms,number_bathrooms,clean_type,recurring,date,time,city_name} = req.body;
  try {

      const query = `INSERT INTO school_order(number_rooms,number_bathrooms,clean_type,recurring,date,time,city_name)
                    VALUES ($1, $2, $3, $4,$5,$6,$7)
                    RETURNING id`;
      const values = [number_rooms,number_bathrooms,clean_type,recurring,date,time,city_name];
      const result = await db.query(query, values);
      const newUserId = result.rows[0].id;
      res.status(201).json({ message: 'Adding order school successfully', user_id: newUserId });
  } catch (error) {
      console.error('Failed to register:', error);
      res.status(500).json({ error: 'Failed to register' });
  }
});






app.post('/addorderoffice', async (req, res) => {
  const {full_name,phone_number,business_name,no_employee,square_footage,city_name} = req.body;
  try {
      const query = `
          INSERT INTO office_order (full_name,phone_number,business_name,no_employee,square_footage,city_name)
          VALUES ($1, $2, $3,$4,$5,$6)
          RETURNING id`;
      const values = [full_name,phone_number,business_name,no_employee,square_footage,city_name];
      if(userloggedin!=null){
           const result = await db.query(query, values);
           const newBlogId = result.rows[0].blog_id;
           res.status(201).json({ message: 'Add order office sucessfully', blog_id : newBlogId });
      }
      else{
          res.json("The user is not login")
      }
  } catch (error) {
      console.error('Error adding blog:', error);
      res.status(500).json({ error: 'Failed to add the blog' });
  }
});








app.listen(port, () => {
    console.log(`server running in port ${port}`);
})
