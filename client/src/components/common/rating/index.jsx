import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

function StarRatingComponent({ rating, handleRatingChange }) {
    return (
        [1, 2, 3, 4, 5].map((item,index) => (
            <Button
                key={index}
                className={`p-2 rounded-full transition-colors 
            ${item <= rating ?
                        'text-yellow-500 hover:bg-black'
                        : 'text-black hover:bg-primary hover:text-primary-foreground'
                    }`} 
                    variant="outline" 
                    size="icon"
                    onClick={handleRatingChange ? ()=> handleRatingChange(item) : null}
                    >
                <StarIcon className={`w-6 h-6 ${item <= rating ? 'fill-yellow-500' : 'fill-black'}`} />
            </Button>
        ))
    )
}

export default StarRatingComponent;