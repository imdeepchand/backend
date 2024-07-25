import moment from "moment";
import { MongoClient } from "mongodb";

export class MongoHelper {
    public static client : MongoClient;

    static async connect (url:string): Promise<any> {
        return await MongoClient.connect(url)
    }

    public disconnect():void{
        MongoHelper.client.close();
    }
}


//Query helper

export class MongoQueryBuilder {
    static buildSearchQuery(fields:string[],keyword:string) {

        const ors =  fields.map((i: string) => {
            let index: {[SearchFieldKey:string]:{ $exists:boolean ,$regex:string, $options:string }} = {};
            index[i] = { $exists:true ,$regex:`${keyword}`, $options:"i" }
            return index;
        })
        return {
            $or:ors
        };
    }
    static buildDateRangeQuery(fromDateString:string,toDateString:string,field:string="createdAt"):{[key:string]:any} {
        let query:{[key:string]:{[key:string]:Date}} = {};
        
        query[field] = {};
        if(fromDateString!=""){

            let date = moment(fromDateString).toDate();
            query[field].$gte = date;
        }
        if(toDateString!=""){

            let date =moment(toDateString).add(1,"days").toDate();
            query[field].$lte = date;
        }
        if(Object.keys(query[field]).length<1){
            return {}
        }else{
            return query;
        }
    }
}


export function createSearchIndexes(fields:string[],keyword:string) {

    const ors =  fields.map((i: string) => {
        let index: any = {};
        // console.log("searchText",{ $exists:true ,$regex:`${keyword}`, $options:"i" })
        index[i] = { $exists:true ,$regex:`${keyword}`, $options:"i" }
        return index;
    })
    return {
        $or:ors
    };
}
export function createDateRangeOnIndex(from:string,to:string,index:string="createdAt") {
    let fromTo:any = {};
    fromTo[index] = {};
    if(from!=""){
        let date = new Date(`${moment(from).format("YYYY-MM-DD")+"T00:00:00.000Z"}`);
        console.log(date);
        fromTo.createdAt.$gte = date;
    }

    if(to!=""){
        let date = new Date(`${moment(to).add(1,"days").format("YYYY-MM-DD")+"T23:59:00.000Z"}`);
        fromTo.createdAt.$lte = date;      
    }
    if(Object.keys(fromTo[index]).length<1){
        return {}
    }else{
        console.log(fromTo,"fromTo")
        return fromTo;
    }
}