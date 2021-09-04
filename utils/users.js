const users=[];

// Join user to chat

function userjoin(id,username,room){

    const user={id,username,room};
    users.push(user);
    return user;
}

// Get current users

function getCurrentUser(id){

    return users.find(user=>user.id===id);
}

// User leaves chat

function userLeave(id){
    const idx=users.findIndex(user=>user.id===id);

    if(idx!=-1){
        return users.splice(idx,1)[0];
    }
}

// Get room users

function getRoomUser(room){
    return users.filter(user=>user.room===room);
}

module.exports={
    userjoin,
    getCurrentUser,
    userLeave,
    getRoomUser
}