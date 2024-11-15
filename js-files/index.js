//-------------------------------------------------------------------------------------------------
"use strict";

//______________________global core modules___________________________________________

const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const app = express();
//______________________ End global core modules___________________________________________

let port = 3000;
//simulation auth
let isLoggedIn = true;
let Auth = (req, res, next) => {
  if (isLoggedIn) {
    next();
  } else {
    return res.json({ message: "Not Authorized" });
  }
};
//__________________________________________________________________
//middle ware
app.use(express.json(), Auth);
//______________________________________________________________________

//----------------------------------Assignment5 for Node Js ---------------------------------------------------------------
/*
 *///Q-1
{
  app.get("/", (req, res, next) => {
    return res.status(200).send("Home page");
  });

  app.post("/addUser", (req, res, next) => {
    const { name, age, email, gender, password } = req.body;

    fs.readFile(
      path.join(__dirname, "users.json"),
      { encoding: "utf-8", flag: "r" },
      (err, users) => {
        users = JSON.parse(users);
        const checkUser = users.find((user) => user.email == email);
        if (!checkUser) {
          users.push({ id: Date.now(), name, age, email, gender, password });
          fs.writeFileSync(
            path.join(__dirname, "./users.json"),
            JSON.stringify(users)
          );
          return res
            .status(201)
            .json({ message: "User created successfully", users });
        } else {
          return res.status(409).json({ message: "User already exists" });
        }
      }
    );
  });

  app.patch("/updateUser/:id", (req, res, next) => {
    let indexUse;
    const { id } = req.params;
    const { name, age, gender, password } = req.body;
    // console.log(id);
    // console.log({ name, age, gender, password });

    fs.readFile(
      path.join(__dirname, "users.json"),
      { encoding: "utf-8", flag: "r" },
      (err, users) => {
        users = JSON.parse(users);

        let findUser = users.find((user, index) => {
          if (user.id == Number(id)) {
            // console.log(index);
            indexUse = index;
            return user;
          }
        });
        // console.log(indexUse);
        // console.log(findUser);
        if (findUser) {
          users[indexUse] = req.body; //update  iin array

          fs.writeFileSync(
            path.join(__dirname, "./users.json"),
            JSON.stringify(users)
          );

          return res
            .status(200)
            .json({ message: "User updated successfully", users });
        } else {
          return res.status(400).json({ message: " User id not found." });
        }
      }
    );
  });

  app.delete("/deleteUser/:id?", (req, res, next) => {
    

    const userId = req.params.id || req.body.id;
    // console.log(userId);

    if (userId) {
      // Read the users from the file
      fs.readFile(
        path.join(__dirname, "users.json"),
        { encoding: "utf-8", flag: "r" },
        (err, users) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Error reading user file." });
          }
          users = JSON.parse(users);
          const userIndex = users.findIndex(
            (user) => user.id === parseInt(userId)
          );
          // console.log(userIndex);

          // Check if the user exists
          if (userIndex !== -1) {
            // Remove the user from the array
            users.splice(userIndex, 1);
            // Write the updated user array back to the file
            fs.writeFile(path.join(__dirname, "./users.json"),
              JSON.stringify(users), (err) => {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .json({ message: "Error writing to user file." });
                }
                res.json({ message: "User deleted successfully.",users });
              }
            );
            
          } else {
            return res.status(404).json({ message: " User id not found." });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "User id is required " });
    }
 

   
  });

  app.get("/getUserByName", (req, res, next) => {
    // console.log(req.query);
    const { searchkey } = req.query;
    // console.log(searchkey);
    // Check if the name is provided
    if (!searchkey) {
      return res.status(400).json({ message: "search key is required." });
    }

    fs.readFile(
      path.join(__dirname, "users.json"),
      { encoding: "utf-8", flag: "r" },
      (err, users) => {
         if (err) {
           console.error(err);
           return res.status(500).json({ message: "Error reading user file." });
         }
        
        users = JSON.parse(users);

        const searchUser = users.filter((user) =>
          user.name.toLowerCase().includes(searchkey)
        );

        searchUser.length > 0
          ? res.status(200).json({ message: "Done  ", searchUser })
          : res.status(404).json({ message: "User name not found" });
      }
    );
  });

  app.get("/getUserById/:id", (req, res, next) => {
    const userId = req.params.id;
    // console.log(userId);

    if (userId) {
      // Read the users from the file
      fs.readFile(
        path.join(__dirname, "users.json"),
        { encoding: "utf-8", flag: "r" },
        (err, users) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ message: "Error reading user file." });
          }
          users = JSON.parse(users);
           const findUser = users.find((user) => user.id == Number(userId));

          // Check if the user exists
          if (findUser) {
            return res.status(200).json({ message: "Done  ", findUser });
          } else {
            return res.status(404).json({ message: " User id not found." });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "User id is required " });
    }
  });



  app.all("*", (req, res, next) => {
    return res.status(400).json({ message: "page not found" });
  });

  // Server listens on port 3000
  const server = app.listen(port, "localhost", 511, () => {
    console.log(`Server is running on localhost ${port}`);
  });
  // server error connect
  server.on("error", (err) => {
    if (err.code == "EADDRINUSE") {
      //  port=3001
      console.error("server error..invalid port...port token");
      // setTimeout(() => {
      //   server.listen(port)
      // }, 1000);
      //------------or------------
      setTimeout(() => {
        server.close();
        server.listen(port);
      }, 1000);
    }
  });
}
//_____________________________________________________________________
//Q-2 NODE JS INTERNAL
//Task 2.1: What is the Node.js Event Loop?
{
  /*
  The Node.js Event Loop enables non-blocking I/O operations, allowing it to handle high-throughput applications
   like web servers efficiently. It keeps the single-threaded architecture of Node.js responsive
    by offloading and managing asynchronous operations, which enables developers to build fast,
     scalable applications without dealing with multithreading complexities


  // main.run()
  // while()--> represent event loop and contain 3 ARRAY TO CHECK 
  const timersOperation = []; //as  setTimeout, setInterval, setimmediate
  const osOperation = []; //as listen server createserver
  const longRunningOperation = []; //as  fs , crypto
  while (
    timersOperation.length ||
    osOperation.length ||
    longRunningOperation.length
  ) {
    //1-check if any timers are ready to be execute => setTimeout, setInterval
    //2-check os or long are ready to be execute
    //3-pause until any timer(setTimeout, setInterval) ready to run
    //4-setimmediate (the end tick of the loop)
    //5-listen to any close event
  }

  //main.close()

  */
}
//Task 2.2: What is the Role of the V8 Engine?
{
  /*
The V8 engine compiles JavaScript directly into machine code, 
allowing it to execute JavaScript rapidly. Unlike traditional interpreters that 
convert code line-by-line, V8 compiles the entire script into machine code using Just-In-Time (JIT)
 compilation, optimizing performance.

 Optimizing Compiler:
    V8 has an optimizing compiler (Turbofan) 
    that analyzes and optimizes code as it runs, resulting in better performance over time,
    especially for code that executes repeatedly.


V8 provides Node.js with:

. Speed through JIT compilation and optimization.
. Efficient memory management and garbage collection.
. Cross-platform support and an open-source ecosystem.
. Native extension capabilities for integrating C++ modules.
. By using V8, Node.js offers a performant, modern, and widely compatible JavaScript runtime for server-side applications, 
. making it one of the fastest JavaScript run times available.
*/
}
//Task 2.3: What is the Node.js Thread Pool and How to Set the Thread Pool Size?
{
  /*
  The thread pool in Node.js is provided by the libuv library,
   which handles some of Node.js's non-blocking operations by offloading them 
   to a pool of worker threads. Common tasks managed by the thread pool include:

            File System Operations: fs.readFile, fs.writeFile, etc.
            DNS Lookups: If dns.lookup() doesn’t use the OS’s caching.
            Compression: Using modules like zlib.
            Cryptographic Functions: crypto.pbkdf2, crypto.scrypt, and other cryptographic operations.

By moving these types of operations to the thread pool, Node.js can continue processing other tasks
 without being blocked by long-running operations.

. Default Thread Pool Size
By default, the Node.js thread pool has 4 threads.
 This means that up to four tasks can be processed concurrently in the thread pool.
  If there are more than four tasks waiting, the excess tasks are queued until a thread becomes available.

  *To set the thread pool size,
   you can specify {UV_THREADPOOL_SIZE} in the terminal before running your Node.js application.


   However, increasing the thread pool size also consumes more memory 
   and can cause overhead, as each thread requires system resources.
    It’s best to experiment with different sizes and measure performance to find an optimal
     setting for your specific workload
  */
}
//Task 2.4: What is the purpose of the libuv library in Node.js?
{
  /*
  Libuv is an open-source library built-in C. It has a strong focus on asynchronous
   and  I/O, this gives node access to the underlying computer operating system,
  file system, and networking.
 Libuv implements two extremely important features of node.js  
 . Event loop
 . Thread pool

  libuv is foundational to its non-blocking architecture.
   It manages the event loop, asynchronous I/O, thread pool, and cross-platform compatibility.
    By abstracting OS-level differences and efficiently managing asynchronous operations,
     libuv enables Node.js to handle high-concurrency applications in a single-threaded environment,
      making it ideal for I/O-intensive and scalable applications.
  */
}
//Task 2.5: Explain how Node.js handles asynchronous I/O operations.
{
  /*

  Node.js handles asynchronous I/O operations using an event-driven, non-blocking architecture.
   This approach allows Node.js to efficiently handle multiple tasks without waiting for each operation
    to complete sequentially, making it highly suitable for I/O-bound tasks like reading from a file,
     querying a database, or handling network requests.

     Here's a breakdown of how Node.js manages asynchronous I/O:

1- Single-Threaded Event Loop:
 Node.js operates on a single thread using an event loop,
  which continuously listens for and processes incoming events, such as I/O operations, timers, or network requests.
   Rather than spawning new threads for each task, Node.js queues tasks to be handled as they complete.

2- Non-Blocking I/O Operations: 
When an asynchronous I/O operation, such as reading a file, is initiated,
 Node.js delegates the task to the system’s underlying OS, which has mechanisms to handle I/O operations efficiently.
  Node.js does not wait for the operation to finish; instead, it moves on to handle other tasks in the event loop.

3- Callback and Promises:
 Once the I/O operation is complete, Node.js uses a callback function, promise, or async/await syntax 
 to handle the result. When the operation is done, the callback (or promise) is added to the event loop, 
 ready to execute with the operation’s outcome.

4- Libuv and Worker Pool: 
Node.js relies on a library called libuv to manage the event loop and support asynchronous I/O operations. 
Libuv provides a thread pool (worker pool) that can handle expensive or blocking operations,
 such as file system access and cryptographic functions, without blocking the main event loop.
  This pool can execute tasks concurrently, allowing Node.js to handle more intensive operations efficiently.

5- Event Loop Phases: 
The event loop consists of multiple phases 
(e.g., timers, I/O callbacks, idle, and poll), where each phase handles specific types of callbacks in a particular order.
 This structure organizes the flow of asynchronous operations, ensuring callbacks are executed at the appropriate time.

ex:
  {
  const fs = require("fs");
  const crypto = require("crypto");

  // OS delegation for network request
  const https = require("https");
  https.get("https://example.com", (res) => {

    res.on("data", (data) => console.log('OS delegated completed'));
  });
  // Thread pool for file operation
  fs.readFile("data.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log(`fs read complete ---> ${data}`);
    
  });
  // Thread pool for CPU-intensive task
  crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
    console.log("Hashing complete");
  });
  crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
    console.log("Hashing complete");
  });
  crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
    console.log("Hashing complete");
  });
  crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
    console.log("Hashing complete");
  });
  crypto.pbkdf2("password", "salt", 100000, 64, "sha512", () => {
    console.log("Hashing complete");
  });
}
  In this example:
The network request is handled by the OS’s asynchronous I/O system.
The cryptographic function and file reading are handled by the thread pool.

In Node.js, using thread pools and OS delegation effectively can help manage concurrency,
 optimize performance, and avoid blocking the main thread.

  */
}

//--------------------------------------------------------------------------------------------------

// //--------------------------------------------------------------------------------------------------
//*************************************************************************************************
//---------------------------------END OF ASSIGNMENT THANK YOU-------------------------------------
//*************************************************************************************************
//********************************Dev by Basem mouner rizk**********************************************
