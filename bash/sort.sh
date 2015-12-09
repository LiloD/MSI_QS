cat * | grep -v '-' | sed 's|[,.\r?:]||g' | tr ' ' '\n' | tr '[:upper:]' '[:lower:]' | grep '^[a-z]\+$' | sort | uniq -c | sort -nr
