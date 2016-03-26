local io = require("io")
local json = require("json")
local lfs = require("lfs")

data = {}

function data.extend (original, append)
    for i=1,#append do
        original[#original+1] = append[i]
    end
end

local dir = "/usr/share/factorio/base/prototypes/recipe/"
for f in lfs.dir(dir) do
    local file = dir .. f
    if lfs.attributes(file, "mode") == "file" then
        dofile(file)
    end
end


local recipes = {}
for i=1,#data do
    local recipe = data[i]

    recipes[recipe["name"]] = recipe
end


print(json.encode(recipes))
