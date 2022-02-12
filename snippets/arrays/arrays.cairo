%builtins output range_check

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.serialize import serialize_word
from starkware.cairo.common.uint256 import (Uint256, uint256_add)


func uint256_array_sum{output_ptr: felt*, range_check_ptr}(arr_len: felt, arr: Uint256*) -> (sum: Uint256):
    if arr_len == 0:
        return (Uint256(0, 0))
    end


    let (sub_sum) = uint256_array_sum(arr_len-1, arr + Uint256.SIZE)
    let (sum, is_overflow) = uint256_add([arr], sub_sum)
    assert is_overflow = 0

    return (sum)
end


func main{output_ptr: felt*, range_check_ptr}():

    let (arr: Uint256*) = alloc()

    assert arr[0] = Uint256(3, 0)
    assert arr[1] = Uint256(3, 0)
    assert arr[2] = Uint256(3, 0)
    assert arr[3] = Uint256(3, 0)

    let (sum) = uint256_array_sum(4, arr)

    serialize_word(sum.low)

    assert sum = Uint256(12, 0) 
    return ()
end

