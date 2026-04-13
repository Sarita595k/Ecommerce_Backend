export class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    // adding the search functionality 

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: `i`
            }
        } : {}
        // console.log(keyword)
        this.query = this.query.find({ ...keyword })
        return this
    }

    // for adding the filter functionality
    filter() {
        const queryCopy = { ...this.queryStr }
        // console.log(queryCopy)

        // removing filelds from the query
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(ele => delete queryCopy[ele])

        console.log(queryCopy)

        // advance filter for price,ratings etc
        // let queryStr = JSON.stringify(queryCopy)
        // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

        // console.log(queryStr)
        // const parsedQuery = JSON.parse(queryStr);

        // console.log("Final MongoDB query:", parsedQuery);

        this.query = this.query.find(queryCopy)
        return this
    }
    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)

        this.query = this.query.limit(resPerPage).skip(skip)
        return this
    }
}