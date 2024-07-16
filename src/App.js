import { Routes, Route } from "react-router-dom";
import './App.css';
import  Profile  from './pages/Profile';
import  User  from './pages/Users'
import { LoginPage } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RoleBasedProtection } from "./components/RoleBasedProtection";
import { AuthProvider } from "./hooks/useAuth";
import { Secret } from "./pages/Secret";
import NotFound from './pages/NotFound';
import { AddUser } from "./pages/AddUser";
import { UpdateUser } from "./pages/UpdateUser";
import ListFoodItems from "./pages/ListFoodItems";
import AddFoodItem from "./pages/AddFoodItem";
import EditFoodItem from "./pages/EditFoodItem";
import DropFoodItem from "./pages/DropFoodItem";
import SortUpdatedItemsByDate from "./pages/SortUpdatedItemsByDate";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useEffect } from "react";
import axios from "axios";
import AddRecipe from "./pages/AddRecipe";
import ListRecipes from "./pages/ListRecipes";
import UpdateRecipe from "./pages/UpdateRecipe";
import DropItemsByRecipe from "./pages/DropItemsByRecipe";
import SystemLogRequest from "./pages/SystemLogRequest";
import {SuperAdminProtection} from "./components/SuperAdminProtection";
import SortDroppedMenuItems from "./pages/SortDroppedMenuItems";
import { useAuth } from "./hooks/useAuth";
import UpdateIndividualInformation from "./pages/UpdateIndividualInfornation";


function App() {

  

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = "Are you sure you want to leave?";
      event.preventDefault();
      console.log("Before unload event triggered");
      handleLogout();
      
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  const handleLogout = () => {
    console.log("clicked");
    //axios.get('http://localhost:5500/auth/logout').then(resp => console.log(resp)).catch(err => console.log(err));
    axios.post('http://localhost:5500/auth/logout',{},{withCredentials: true}).then(resp => {
        console.log(resp);
        
    }).catch(err => console.log(err));
    
}
  useEffect(() => {
    console.log("In App.js", new Date());
  }, []);





  return (
    <>
    <AuthProvider>
    <ProtectedRoute>
    <Navbar/>
    </ProtectedRoute>
    <Routes>
      <Route path="/profile" element={
       <ProtectedRoute> 
        <Profile />
        </ProtectedRoute> 
        }/>
      <Route path="/user" element={
      <ProtectedRoute>
        <RoleBasedProtection>
        <User />
        </RoleBasedProtection>
      </ProtectedRoute>          
      }/>

      <Route path="/adduser" element={
        <ProtectedRoute>
          <RoleBasedProtection>
          <AddUser/>
          </RoleBasedProtection>
        </ProtectedRoute>
      }/>

      <Route path="/updateuser" element={
        <ProtectedRoute>
          <RoleBasedProtection>
          <UpdateUser/>
          </RoleBasedProtection>
        </ProtectedRoute>
      }/>

      <Route exact path="/login" element={<LoginPage />} />

      <Route
          path="/listitems"
          element={
            <ProtectedRoute>
              <ListFoodItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/additem"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <AddFoodItem />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edititem"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <EditFoodItem />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dropitem"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <DropFoodItem />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />
      
      <Route
          path="/sortitembydate"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <SortUpdatedItemsByDate />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />

<Route
          path="/addrecipe"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <AddRecipe />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />

        <Route
          path="/listrecipes"
          element={
            <ProtectedRoute>
              
              <ListRecipes />
              
            </ProtectedRoute>
          }
        />


        <Route
          path="/updateindividualinfo"
          element={
            <ProtectedRoute>
              
              <UpdateIndividualInformation />
              
            </ProtectedRoute>
          }
        />

        

        <Route
          path="/updaterecipe"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <UpdateRecipe />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dropitemsbyrecipe"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <DropItemsByRecipe />
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />


        <Route
          path="/systemlogrequest"
          element={
            <ProtectedRoute>
              <RoleBasedProtection>
              <SuperAdminProtection>
              <SystemLogRequest />
              </SuperAdminProtection>
              </RoleBasedProtection>
            </ProtectedRoute>
          }
        />


        <Route
          path="/sortdroppedmenuitems"
          element={
            <ProtectedRoute>
              
              <SortDroppedMenuItems />
              
            </ProtectedRoute>
          }
        />
        


        <Route path="*" element={<NotFound/>}/>
    </Routes>
    <ProtectedRoute>
    <Footer/>
    </ProtectedRoute>
    </AuthProvider>
    </>
  );
}

export default App;
