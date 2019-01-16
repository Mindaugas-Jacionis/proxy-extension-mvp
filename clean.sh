#!/bin/bash
# Halt, Destroy, Clean
vagrant halt
vagrant destroy -f
rm -rf .vagrant
