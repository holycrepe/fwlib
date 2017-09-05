export default interface Guides {
    clear();
    get();
    add();
    remove();
    addVertical(position: number);
    addHorizontal(position: number);
    horizontal_grid(grid_width: number, number_of_columns: number, gutter_width: number);
    vertical_grid(grid_width: number, number_of_columns: number, gutter_width: number);
}