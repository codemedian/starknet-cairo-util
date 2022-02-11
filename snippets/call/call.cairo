%builtins output

from starkware.cairo.common.serialize import serialize_word


func printer{output_ptr: felt*}(a1, a2) -> (r1: felt, r2: felt):

    serialize_word(a1)
    return (8, 9)
end

func main{output_ptr : felt*}():

    [ap] = output_ptr; ap++
    [ap] = 1; ap++
    [ap] = 2; ap++

    call printer

    let output_ptr = cast([ap-3], felt*)
    serialize_word(10)
    return ()
end
