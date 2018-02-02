/** 
* Class containing the data from a vehicle element of the DSX file. 
*/

/**
 * Creates a VehicleData object.
 */
function VehicleData(id) {
	PrimitiveData.call(this, id);
}

VehicleData.prototype = Object.create(PrimitiveData.prototype);

//Getters

//End of getters section

/**
 * Tests if all the fields have valid values. Returns null if true, and an error message string otherwise.
 */
VehicleData.prototype.testParams=function() 
{
	return null;
};