import Collection from '../src/models/collection.schema.js';
import asyncHandler from '../src/service/asyncHandler.js';
import CustomError from '../src/utils/CustomError.js';




export const addCollection= asyncHandler( async (req,res) => {

    const name=req.body;


    if(!name){
        throw new CustomError("Name can't be empty",400);
    }

    const collection=await Collection.create({name});


    if(!collection){
        throw new CustomError("Collection doesn't saved in the database",400);
    }



    res.status(201).json({
        sucess:true,
        message:"Collection added successfully",
        collection
    })

});





export const deleteCollection =asyncHandler( async (req,res) => {
    const {id:collectionId} =req.params;

    if(!id){
        throw new CustomError("ID Can't be empty",400);
    }

    const collection= await Collection.findById();

    if(!collection){
        throw new CustomError("Collection doesnot found in the database",400);
    }

    await collection.remove();

    res.status(200).json({
        sucess:true,
        message:"Product deleted Succesfully",
        collection
    })

})


export const getAll = asyncHandler( (req,res) => {
    const collections=Collection.findAll();

    if(!collections){
        throw new CustomError("Collection is empty",400);
    }


    res.status(200).json({
        sucess:true,
        message:"All Collections are sent to the user",
        collections
    })

})

export const getCollection = asyncHandler( async (req,res) => {
    const name =req.body;

    if(!name){
        throw new CustomError("Name can't be empty",400);
    }

    const collection=Collection.findOne({name});


    if(!collection){
        throw new CustomError("Collection not found",401);
    }



    res.status(200).json({
        sucess:true,
        message:"Collection found",
        collection
    })
})

