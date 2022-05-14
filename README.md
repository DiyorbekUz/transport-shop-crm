# transport-shop-crm

# register form
```

mutation {
  register(
    staffname: "bilol"
    password: "bilol1"
    repeatPassword: "bilol1"
    staffBirthDate: "12.10.2005"
    staffWorkPlace: 1
  ) {
  	status
    message
    token
    data{
      ...on Staff{
        staffId
        staffname
      }
    }
  }
}

```

#login form
```
mutation{
  login(staffname: "bilol" password: "bilol1"){
    status
    message
    token
    data{
      ...on Staff{
      staffId
      staffname
    }
    }
    
  }
}

```

# addBranch

```
mutation{
  addBranch(branchname: "Qashqadarsyso mssoto", branchAdress: "Qashqadaryo"){
    status
    message
    token
    data{
      ...on Branch{
        branchId
        branchname
        branchAdress
        branchCreatedAt
      }
    }
  }
}

```

# changeBranch

```
mutation{
  changeBranch(branchId: 1, branchname: "Tashkentski"){
    status
    message
    token
    data{
      ... on Branch{
        branchId
      }
    }
  }
}
```


# deleteBranch

```
mutation{
  deleteBranch(branchId: 2){
    status
    message
    token
    data{
      ... on Branch{
        branchId
        branchname
        branchAdress
      }
    }
  }
}
```

# addTransport
``` 

mutation uploadFile($transportImg: Upload!){
  addTransport(branchId: 1, transportname: "malibu", transportModel: "malibu2", transportColor: "white", transportImg: $transportImg){
    status
    message
    token
    data{
      ... on Transport{
        transportId
        transportImg
      }
    }
  }
}

```

# deleteTransport

```
mutation{
  deleteTransport(transportId: 2){
    status
    message
    token
    data{
      ... on Transport{
        transportId
      }
    }
  }
}

```