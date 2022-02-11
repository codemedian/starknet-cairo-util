%builtins output

from starkware.cairo.common.serialize import serialize_word
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.registers import get_label_location


func invoke{output_ptr: felt*}(cb, a1, a2) -> (r1, r2):

    [ap] = output_ptr; ap++
    [ap] = a1; ap++
    [ap] = a2; ap++

    call abs cb

    let output_ptr = cast([ap-3], felt*)
    return([ap-2], [ap-1])
end

func printer{output_ptr: felt*}(a1, a2) -> (r1: felt, r2: felt):

    serialize_word(a1)
    return (8, 9)
end

func main{output_ptr : felt*}():
    let (cb) = get_label_location(printer)

    invoke(cb, 1, 2)

    serialize_word(10)
    return ()
end
