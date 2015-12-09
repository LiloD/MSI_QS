#!/usr/bin/env python

from os import listdir
from os.path import isfile, join
import re

qPath = '/home/bo/training/Question Set'
cnts = [open(join(qPath, f)).read()
        for f in listdir(qPath)
        if isfile(join(qPath, f)) and f.endswith('.txt')]

print 'sum of chars', sum([len(cnt) for cnt in cnts])
for cnt in cnts:
    words = [re.sub('[^a-zA-Z]', '', word) for word in cnt.split()]
    words = [word for word in words if len(word) > 0]
    print words
    break
