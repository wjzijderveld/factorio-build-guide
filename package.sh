#!/bin/bash

DIR=$(cd $(dirname $0) && pwd)

OUTPUT="$DIR/artifact/"
TSC=`which tsc`


if [[ !  -d $OUTPUT ]]; then
    mkdir -p $OUTPUT
fi

$TSC --outDir $OUTPUT/app/
cp $DIR/index.html $OUTPUT/
cp -r $DIR/tpl $OUTPUT/
cp -r $DIR/resources $OUTPUT/

cp -r $DIR/node_modules $OUTPUT/
cp $DIR/package.json $OUTPUT/

cd $OUTPUT/
npm prune --production
rm $OUTPUT/package.json
