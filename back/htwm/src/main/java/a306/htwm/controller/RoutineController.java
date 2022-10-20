package a306.htwm.controller;

import a306.htwm.dto.CreateRoutineDTO;
import a306.htwm.dto.ExerciseDTO;
import a306.htwm.service.RoutineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/routine")
@RequiredArgsConstructor
public class RoutineController {

    final private RoutineService routineService;

    @GetMapping("/exercise")
    public ResponseEntity<ArrayList<ExerciseDTO>> getExercise(){
        return ResponseEntity.ok().body(routineService.getExercise());
    }

    @PostMapping("/create")
    public ResponseEntity createRoutine(@RequestBody CreateRoutineDTO createRoutineDTO){
        return ResponseEntity.ok().build();
    }
}
