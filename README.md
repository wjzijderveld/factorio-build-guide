# Factorio build guide

## Goal

In Factorio it is often challenging to find out how many assemblers you need to build, for example, 1 rocket every 10 minutes.
This project gives you some tools to help you decide how to build your factory.

It doesn't give you a blueprint to use, that's where we have [Factorio Blueprints] for :-)
But it does provide you a direction and some hard numbers.

[Factorio Blueprints]: http://factorioblueprints.com

## Input/Output

How this tool works is:

You first input what you want to build (f.e. rocket-part) and how many you want to build per minute.
It will then show you per ingredient, how many assemblers you need and how many resources per minute you need to feed those assemblers.
You can then click on any of the ingredients to get the required build for that.

## Factorio data

The data for these recipes are read from a JSON file in /resources. The script I use for that is in /import/import-recipes.lua
