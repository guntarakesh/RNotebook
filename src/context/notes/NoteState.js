import react, { useState } from "react";
import NoteContext from "./notesContext";
import addNotification from "react-push-notification";

const NoteState = (props)=>{
    
    const baseUrl = process.env.REACT_APP_BASE_URL
    const initialNotes = []

    const [notes,setNotes] = useState(initialNotes);

    // to push-notifications 

    const notifyAddedNote = ()=>{
        addNotification({
          title:"success",
          message: "You have Added the Note sucessfully",
          theme: 'white',
          closeButton: "X",
          duration:4000,
          position:'bottom-right',
      });
      }

    const notifyDeletedNote = ()=>{
        addNotification({
          title:"success",
          message: "You have deleted the Note sucessfully",
          theme: "white",
          closeButton: "X",
          duration:4000,
          position:'bottom-right',
      });
      }

    const notifyEditedNote = ()=>{
        addNotification({
          title:"success",
          message: "You have Updated the Note sucessfully",
          theme: "white",
          closeButton: "X",
          duration:4000,
          position:'bottom-right',
      });
      }

    // to get all notes 
    
    const getNotes = async () => {
        // API Call 
        const response = await fetch(`${baseUrl}/fetchallnotes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token':localStorage.getItem('token')          
        }
        });
        const json = await response.json() 
        setNotes(json)
      }

    // ADD A NOTE 

    const addNote = async (title,description,tag)=>{
        // api call to add note in server side 
        const response = await fetch(`${baseUrl}/addnote`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });

        // to add note in client side 
        const note = await response.json();
        setNotes(notes.concat(note))

        notifyAddedNote();
    }

    // Delete a Note
    
    const deleteNote = async(id)=>{
        
        // delete a note from server side 

        const response = await fetch(`${baseUrl}/deletenote/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            }
        });

        const newNotes = notes.filter((note)=>{
            return note._id !== id;
        })
        setNotes(newNotes);

        notifyDeletedNote();
    }

    // Edit a Note 

    const editNote = async (id,title,description,tag)=>{

        // api call to edit note in server side 
        const response = await fetch(`${baseUrl}/updatenote/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'auth-token':localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });

        const json = response.json();


        let newNotes = JSON.parse(JSON.stringify(notes))
       
        // to edit note in client side 
          for (let index = 0; index < notes.length; index++) {
            const element = notes[index];
            if(element._id === id)
            {
                newNotes[index].title = title ; 
                newNotes[index].description = description ;
                newNotes[index].tag = tag ; 
                break; 
            }
          }
          setNotes(newNotes);

          notifyEditedNote();
    }

    

    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
         {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;