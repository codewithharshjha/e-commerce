class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  
    //there are lots of thing in a queystring so we want only keyword part thats why this.query.keyword
    //return this means we are return the ApiFeaures class
  // filters() {
  //   const queryCopy = { ...this.queryStr };

  //   //Removing some field for cateogry
  //   const removeFields = ["keyboard", "page", "limit"];
  //   //querystr mai agar keyboard,page,limit jaisa kuch bhi hoga to usai delete kr do
  //   removeFields.forEach((key) => delete queryCopy[key]);
  //   //filter for price and rating
  //   let queryStr=JSON.stringify(queryCopy)
  //   queryStr=queryStr.replace(/\b(gt)|(lt)|(gte)|(lte) \b/g,(key)=>`$${key}`)
  //   //yai ek trh ka operator hai jo bs gt ko $gt mai convert kr dega aur hum aisa is lsliyai kr rhai hai kuki mai mongodb mai $lgta hai
  
  //   // console.log(queryCopy)
  //   this.query = this.query.find(JSON.parse(queryStr));
  //   //this.query means Prodcut.find
  //   return this;

  

  //}
  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage){
    const currentPage=Number(this.queryStr.page)||1
    const skip=resultPerPage*(currentPage-1)
    this.query=this.query.limit(resultPerPage).skip(skip)
    return this



  }
}
module.exports = ApiFeatures;
