%lang starknet

from starkware.cairo.common.registers import get_label_location
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.uint256 import (Uint256, uint256_lt, uint256_add, uint256_eq)

struct SomeStruct:
    member a: Uint256
    member b: felt
end

@storage_var
func sv_found_idx() -> (val: felt):
end

func _dummy_foreach{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(callback, current: felt, count: felt) -> (res: felt):

    if count == 0:
        return (-1)
    end

    [ap] = syscall_ptr; ap++
    [ap] = pedersen_ptr; ap++
    [ap] = range_check_ptr; ap++
    [ap] = current; ap++
    [ap] = 10; ap++
    [ap] = 0; ap++
    [ap] = current*3; ap++


    call abs callback

    let syscall_ptr = cast([ap-4], felt*)
    let pedersen_ptr = cast([ap-3], HashBuiltin*)
    let range_check_ptr = [ap-2]
    let r = [ap-1]

    if r == 1:
        return (current)
    end

    return _dummy_foreach(callback, current+1, count-1)
end

func dummy_foreach {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(callback) -> (res: felt):
    return _dummy_foreach(callback, 0, 10)
end


# This funciton is called for every element in the iterated list
# @retval 1 = iteration stops and current index is returned to the caller
# @retval 0 = iteration continues
func loop_handler {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(ride_idx: felt, myStruct: SomeStruct) -> (res: felt):
    # 3rd element in iteration will have this value
    if myStruct.b == 9:
        sv_found_idx.write(ride_idx)
        return (1)
    end


    return (0)
end

@view
func find_ride {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (found_ride : felt):

    let (cb) = get_label_location(loop_handler)

    dummy_foreach(cb)

    let (found_ride) = sv_found_idx.read()
    return (found_ride)
end

