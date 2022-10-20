package a306.htwm.service;

import a306.htwm.dto.ExerciseDTO;
import a306.htwm.dto.FriendDTO;
import a306.htwm.entity.Exercise;
import a306.htwm.entity.Friend;
import a306.htwm.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@Transactional(readOnly = true) // 기본은 false
@RequiredArgsConstructor
public class RoutineService {

    private final ExerciseRepository exerciseRepository;

    public ArrayList<ExerciseDTO> getExercise() {
        ArrayList<Exercise> exercises = exerciseRepository.findAll();
        ArrayList<ExerciseDTO> exerciseDTOS = new ArrayList<>();
        for(Exercise exercise : exercises){
            ExerciseDTO exerciseDTO = ExerciseDTO.builder()
                    .exercise_id(exercise.getId())
                    .name(exercise.getName())
                    .url(exercise.getUrl())
                    .build();
            exerciseDTOS.add(exerciseDTO);
        }
        return exerciseDTOS;
    }
}
