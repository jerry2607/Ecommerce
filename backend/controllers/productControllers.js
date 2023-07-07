const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncErrors");

// get the details of single product
exports.getProductDetails =  catchAsyncError(async (req, res , next ) => {
    // taking id from url parameters
    const id = req.params.id;

    const product = await Product.findById(id);

    // product not found
    if(!product) {
        return next(new ErrorHandler("Product Not Found" , 404));
    }

    // product found
    res.status(200).json({
        success : true ,
        product : product 
    })
});


// create Product review
exports.createProductReview = catchAsyncError(
    async (req , res) => {
        const {rating , comment , productId } = req.body;
        const user = req.user;
        const review = {
            user : user._id ,
            name : user.name ,
            rating : Number(rating) ,
            comment ,
        }
        // finding the product with given ProductId
        const product = await Product.findById(productId);

        // user already review the product
        const isReviewed = product.reviews.find(
            review => review.user.toString() === user._id 
        )

        if(isReviewed) {
            // updating the review
            let previousRating = 0;
            product.reviews.forEach(review => {
                if(review.user.toString() === user._id ) {
                    previousRating = review.rating;
                    review.rating = rating;
                    review.comment = comment;
                }
            })

            product.ratings = ((product.ratings * product.reviews.length) + rating - previousRating)/(product.reviews.length);
            
        }
        else {
            // add review to the product
            product.ratings = ((product.ratings * product.reviews.length) + rating)/(product.reviews.length + 1);
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        await product.save({validateBeforeSave : false});

        res.status(200).json({
            success : true ,
        });
    }
)


// get all reviews of a product
exports.getProductReviews = catchAsyncError(
    async (req , res , next) => {
        const productId = req.query.id;

        // finding the product with given id
        const product = await Product.findById(productId);

        // product not found
        if(!product) {
            return next(new ErrorHandler("Product Not Found" , 404));
        }
        
        res.status(200).json({
            success : true , 
            reviews : product.reviews,
        })
    }
)


// Delete review of a product
exports.deleteReview = catchAsyncError(
    async (req , res , next) => {
        const productId = req.query.productId;

        // finding the product with given id
        const product = await Product.findById(productId);

        // product not found
        if(!product) {
            return next(new ErrorHandler("Product Not Found" , 404));
        }

        // add all rating of each review except given review
        let avg = 0;
        product.reviews.forEach(review => {
            if(review._id.toString() !== req.query.id.toString()) {
                avg += review.rating;
            }
        })

        const ratings = product.reviews.length === 1 ? 0 : avg / (product.reviews.length - 1);

        const numOfReviews = product.reviews.length - 1;

        await Product.findByIdAndUpdate(productId , {
            $pull : {reviews : {_id : req.query.id}},
            ratings ,
            numOfReviews,
        } , {
            new : true ,
            runValidators : true ,
            useFindAndModify : false,
        });
        
        res.status(200).json({
            success : true , 
        })
    }
)