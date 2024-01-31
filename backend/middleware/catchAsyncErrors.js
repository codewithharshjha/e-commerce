module.exports =(theFunc)=>(req,res,next)=>{
    Promise.resolve(theFunc(req,res,next)).catch(next)

}
//here Promise is a prebuild function in javascrip
//we are trying to work with error of async types
//we are passing theFunc from productcontrller