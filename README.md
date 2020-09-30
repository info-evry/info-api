# info-api
Private HTTP API for Info Evry Student Group at University of Evry


## Documentation (api v1)

### Query timetable 

#### URL Format :

```https://api.info-evry.fr/v1/edt/<pathway>/<group>/<day>/<month>/<year>```

##### Example : 


To query the timetable of  student of 1<sup>st</sup> year of Computer Science at Univ-Evry(e. g. Licence 1<sup>ère</sup> année), for the week containing the October, 10<sup>th</sup> 2020 : 


```https://api.info-evry.fr/v1/edt/l1/g1/10/10/2020```


##### Result : 

The client will receive the required timetable at png image format (with 64-bit base) under json formated data : 

```json
{
	"level":"L1",
	"sublevel":"Groupe 1",
	"week":41,
	"year":"2020",
	"data":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB04AAAOxCAMAAABFY3T9AAAA51BMVEX///8AAADIyMjh4eHO87up/K35/Km1qfz8qake/x7/yABA4NDT/+z/u/b/3oS+hP///wCLrP9kZGQyMjJ9fX2vr68ZGRlLS0uWlpbLy8vOzs7R0dHU1NTX19fd3d3a2tr ..." 
}
```
