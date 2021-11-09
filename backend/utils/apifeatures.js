class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
                name : {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                }
            } : {}

        // console.log(keyword);

        this.query = this.query.find({...keyword});
        return this;
    }


    filter(){

        // Do not use this because it use reference of this.queryStr ,so if we change queryReference then this.queryStr will also change.

        // const queryReference = this.queryStr;

        // this codes not change this.queryStr as it creates a copy;


        const queryCopy = {...this.queryStr};

        // Remove some field for category;
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key=> delete queryCopy[key]);

        // Filter for price and Rating

        let queryStr = JSON.stringify(queryCopy).replace(/\b(gt|lt|gte|lte)\b/g,key=>`$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));

        this.query = this.query.find(queryCopy);

        return this;

    }

}


module.exports = ApiFeatures;