#!/bin/bash

yarn 
yarn migration:run
yarn seeds:run
yarn runProcess