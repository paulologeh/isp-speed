output = open('data.csv', 'w')

# dataObj = {}
with open('speed_data.csv', 'r') as file:
    for line in file:
        line = line.split(',')
        line[0] += ' ' + line[1]
        del line[1]
        output.write('{}'.format(','.join(line)))
#     count = 0
#     for line in file:
#         line = line[:-1]
#         line = line.split(',')
#         line[0] = line[0][0:8]
#         key = line[0] + ' ' + line[1][0:2]
#         if not key in dataObj.keys():
#             dataObj[key] = []

#         dataObj[key].append(line)

# for key in dataObj:
#     fstream = ','.join(dataObj[key][0])
#     output.write('{}\n'.format(fstream))

# output.close()
