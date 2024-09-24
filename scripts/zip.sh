#!/bin/bash

next_version=$1

cd dist || exit 1
zip ../mobile.de-pdf-export-"$next_version".zip ./*
cd ..
